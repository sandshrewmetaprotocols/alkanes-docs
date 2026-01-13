-- Pool candles: Fetch pool reserves at multiple block heights for OHLC data
-- This script uses metashrew_view with prebuilt protobuf payloads
-- and fetches actual block timestamps from Bitcoin block headers
--
-- Args: pool_payload (hex), start_height, end_height, interval
--
-- The pool_payload is the exact protobuf hex used by alkanes-cli pool-details
-- Example payloads (from mainnet-cli.sh alkanes pool-details):
--   DIESEL/frBTC (2:77087): "0x208bce382a06029fda04e7073001"
--   DIESEL/bUSD (2:68441): "0x208bce382a0602d99604e7073001"

-- args is passed as a table where args[1] is the array of parameters
local params = args[1] or {}
local pool_payload = params[1]
local start_height = tonumber(params[2])
local end_height = tonumber(params[3])
local interval = tonumber(params[4]) or 144

-- Validate inputs
if not pool_payload or not start_height or not end_height then
    return { error = "Missing required arguments: pool_payload, start_height, end_height" }
end

if start_height > end_height then
    return { error = "start_height must be <= end_height" }
end

-- Helper to parse little-endian u128 from hex string at given offset
-- offset is in bytes (not hex chars)
local function parse_u128_le(hex_str, byte_offset)
    -- Convert byte offset to hex char offset
    local hex_offset = byte_offset * 2
    local hex_len = 32 -- 16 bytes = 32 hex chars

    if #hex_str < hex_offset + hex_len then
        return nil
    end

    local hex_slice = hex_str:sub(hex_offset + 1, hex_offset + hex_len)

    -- Reverse bytes for little-endian
    local reversed = ""
    for i = #hex_slice - 1, 1, -2 do
        reversed = reversed .. hex_slice:sub(i, i + 1)
    end

    -- Convert to number (Lua 5.1 doesn't have native 64-bit, but we can handle smaller values)
    -- For reserves that fit in 53 bits, this will work
    return tonumber(reversed, 16) or 0
end

-- Get block timestamp from Bitcoin block header
local function get_block_timestamp(height)
    local success, block_hash = pcall(function()
        return _RPC.btc_getblockhash(height)
    end)
    if not success or not block_hash then return nil end

    local success2, block = pcall(function()
        return _RPC.btc_getblock(block_hash, 1)  -- verbosity 1 for header info
    end)
    if not success2 or not block then return nil end

    return block.time or block.mediantime
end

-- Result array
local results = {
    start_height = start_height,
    end_height = end_height,
    interval = interval,
    data_points = {}
}

-- Query pool state at each interval using metashrew_view
for height = start_height, end_height, interval do
    local block_tag = tostring(height)

    -- Call metashrew_view with the pool details payload
    local success, response = pcall(function()
        return _RPC.metashrew_view("simulate", pool_payload, block_tag)
    end)

    if success and response then
        -- Response is a hex string like "0x0a88011a8501..."
        local data_hex = response
        if type(data_hex) == "string" then
            -- Remove 0x prefix if present
            if data_hex:sub(1, 2) == "0x" then
                data_hex = data_hex:sub(3)
            end

            -- The response format from pool_details opcode (999):
            -- Wrapped in protobuf: 0a XX 1a YY <inner_data>
            -- We need to skip the protobuf wrapper to get to the inner data
            -- Inner format: token_a(32) + token_b(32) + reserve_a(16) + reserve_b(16) + total_supply(16) + name

            -- Find the inner data by looking for the pattern
            -- The inner data starts after "1a XX" where XX is the length
            local inner_start = nil
            if #data_hex >= 8 then
                -- Look for "1a" marker (protobuf field 3, type bytes)
                local marker_pos = data_hex:find("1a")
                if marker_pos then
                    -- Skip "1a" and length byte(s)
                    local len_byte = tonumber(data_hex:sub(marker_pos + 2, marker_pos + 3), 16) or 0
                    if len_byte < 128 then
                        inner_start = marker_pos + 4 -- 2 for "1a" + 2 for 1-byte length
                    else
                        inner_start = marker_pos + 6 -- 2 for "1a" + 4 for 2-byte varint length
                    end
                end
            end

            if inner_start and #data_hex >= inner_start + 223 then -- Need at least 112 bytes (224 hex chars) for reserves
                local inner_hex = data_hex:sub(inner_start)

                -- Parse reserves from inner data
                -- token_a: bytes 0-31 (32 bytes)
                -- token_b: bytes 32-63 (32 bytes)
                -- reserve_a: bytes 64-79 (16 bytes, u128 LE)
                -- reserve_b: bytes 80-95 (16 bytes, u128 LE)
                -- total_supply: bytes 96-111 (16 bytes, u128 LE)

                local reserve_a = parse_u128_le(inner_hex, 64)
                local reserve_b = parse_u128_le(inner_hex, 80)
                local total_supply = parse_u128_le(inner_hex, 96)

                if reserve_a and reserve_b and total_supply then
                    -- Get actual block timestamp from Bitcoin block header
                    local timestamp = get_block_timestamp(height)

                    table.insert(results.data_points, {
                        height = height,
                        timestamp = timestamp,  -- Unix timestamp from block header
                        reserve_a = reserve_a,
                        reserve_b = reserve_b,
                        total_supply = total_supply
                    })
                end
            end
        end
    end
end

results.count = #results.data_points
return results
