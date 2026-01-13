/**
 * Database seed script for development
 * Populates the database with test data for governance and forum features
 */
import { PrismaClient, ProposalState, DiscussionType, PostType, ReactionType, NotificationLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data (in reverse order of dependencies)
  console.log('  Clearing existing data...');
  await prisma.notification.deleteMany();
  await prisma.addressBalance.deleteMany();
  await prisma.votingPowerSnapshot.deleteMany();
  await prisma.mention.deleteMany();
  await prisma.reaction.deleteMany();
  await prisma.postRevision.deleteMany();
  await prisma.discussionParticipant.deleteMany();
  await prisma.discussionTag.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.discussion.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.category.deleteMany();
  await prisma.delegate.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.governanceSettings.deleteMany();

  // Create governance settings
  console.log('  Creating governance settings...');
  await prisma.governanceSettings.create({
    data: {
      id: 'default',
      votingDelay: 0,
      votingPeriod: 17280, // ~3 days in blocks
      proposalThreshold: BigInt('1000000000'), // 1000 DIESEL (6 decimals)
      quorumNumerator: 4,
      quorumDenominator: 100,
      dieselAlkaneBlock: 2,
      dieselAlkaneTx: 0,
      minDieselToPost: BigInt(0),
      minDieselToCreateDiscussion: BigInt(0),
    },
  });

  // Create categories
  console.log('  Creating categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'General Discussion',
        slug: 'general',
        description: 'General community discussions about Alkanes and Bitcoin DeFi',
        color: '#6366f1',
        position: 0,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Governance Proposals',
        slug: 'governance',
        description: 'Discussion of active and pending governance proposals',
        color: '#10b981',
        position: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Development',
        slug: 'development',
        description: 'Technical discussions, development updates, and API questions',
        color: '#f59e0b',
        position: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Announcements',
        slug: 'announcements',
        description: 'Official announcements from the Alkanes team',
        color: '#ef4444',
        position: 3,
        isReadOnly: true,
      },
    }),
  ]);

  const [generalCat, governanceCat, devCat, announcementsCat] = categories;

  // Create tags
  console.log('  Creating tags...');
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'diesel', slug: 'diesel', color: '#22c55e' } }),
    prisma.tag.create({ data: { name: 'governance', slug: 'governance', color: '#3b82f6' } }),
    prisma.tag.create({ data: { name: 'development', slug: 'development', color: '#f59e0b' } }),
    prisma.tag.create({ data: { name: 'question', slug: 'question', color: '#8b5cf6' } }),
    prisma.tag.create({ data: { name: 'tutorial', slug: 'tutorial', color: '#ec4899' } }),
  ]);

  // Create user profiles
  console.log('  Creating user profiles...');
  const users = await Promise.all([
    prisma.userProfile.create({
      data: {
        address: 'bc1qadmin1234567890abcdef',
        displayName: 'Alkanes Team',
        bio: 'Official Alkanes Foundation account',
        verified: true,
        trustLevel: 4,
        dieselBalance: BigInt('100000000000000'), // 100M DIESEL
      },
    }),
    prisma.userProfile.create({
      data: {
        address: 'bc1qwhale1111111111111111',
        displayName: 'DieselWhale',
        bio: 'Long-term DIESEL holder and governance participant',
        verified: true,
        trustLevel: 3,
        dieselBalance: BigInt('50000000000000'), // 50M DIESEL
      },
    }),
    prisma.userProfile.create({
      data: {
        address: 'bc1qdev2222222222222222',
        displayName: 'AlkanesDev',
        bio: 'Building on Bitcoin with Alkanes',
        verified: false,
        trustLevel: 2,
        dieselBalance: BigInt('5000000000000'), // 5M DIESEL
      },
    }),
    prisma.userProfile.create({
      data: {
        address: 'bc1qnewbie333333333333',
        displayName: 'NewToAlkanes',
        bio: 'Learning about Bitcoin DeFi',
        verified: false,
        trustLevel: 1,
        dieselBalance: BigInt('100000000000'), // 100K DIESEL
      },
    }),
  ]);

  const [adminUser, whaleUser, devUser, newbieUser] = users;

  // Create proposals with linked discussions
  console.log('  Creating proposals and discussions...');

  const now = new Date();
  const dayMs = 86400000;

  // Proposal 1: Active proposal
  const proposal1 = await prisma.proposal.create({
    data: {
      title: 'Increase DIESEL emissions for liquidity providers',
      body: `This proposal suggests increasing DIESEL token emissions by 10% for liquidity providers to incentivize deeper liquidity pools.

## Rationale

Deeper liquidity leads to better price stability and lower slippage for traders. Currently, liquidity provision rewards are not competitive with other DeFi protocols.

## Implementation

1. Modify emission schedule in the smart contract
2. Deploy updated contract via governance execution
3. Communicate changes to the community

## Timeline

If approved, implementation would begin within 7 days of proposal closure.

## Risks

- Increased inflation could put downward pressure on DIESEL price
- May attract short-term yield farmers rather than long-term participants`,
      choices: ['For', 'Against', 'Abstain'],
      author: whaleUser.address,
      authorSig: 'mock-sig-proposal-1',
      snapshot: 850000,
      start: new Date(now.getTime() - dayMs), // Started yesterday
      end: new Date(now.getTime() + dayMs * 6), // Ends in 6 days
      state: ProposalState.ACTIVE,
      scores: JSON.stringify(['15000000000000', '3000000000000', '500000000000']),
      totalVotes: BigInt('18500000000000'),
    },
  });

  // Create discussion for proposal 1
  const discussion1 = await prisma.discussion.create({
    data: {
      title: '[Proposal] Increase DIESEL emissions for liquidity providers',
      slug: 'proposal-increase-diesel-emissions',
      author: whaleUser.address,
      categoryId: governanceCat.id,
      proposalId: proposal1.id,
      type: DiscussionType.PROPOSAL,
      postsCount: 4,
      viewsCount: 234,
      lastPostAt: new Date(now.getTime() - 3600000),
      bumpedAt: new Date(now.getTime() - 3600000),
    },
  });

  // Create posts for discussion 1
  await prisma.post.create({
    data: {
      discussionId: discussion1.id,
      author: whaleUser.address,
      raw: proposal1.body,
      cooked: `<p>${proposal1.body.replace(/\n/g, '</p><p>')}</p>`,
      postNumber: 1,
      postType: PostType.REGULAR,
    },
  });

  await prisma.post.create({
    data: {
      discussionId: discussion1.id,
      author: devUser.address,
      raw: 'I support this proposal. Deeper liquidity is essential for a healthy DEX ecosystem.',
      cooked: '<p>I support this proposal. Deeper liquidity is essential for a healthy DEX ecosystem.</p>',
      postNumber: 2,
      postType: PostType.REGULAR,
    },
  });

  await prisma.post.create({
    data: {
      discussionId: discussion1.id,
      author: newbieUser.address,
      raw: 'How will this affect the tokenomics long-term? Concerned about inflation.',
      cooked: '<p>How will this affect the tokenomics long-term? Concerned about inflation.</p>',
      postNumber: 3,
      postType: PostType.REGULAR,
    },
  });

  await prisma.post.create({
    data: {
      discussionId: discussion1.id,
      author: whaleUser.address,
      raw: 'Good question. The 10% increase is modest and we can always adjust in future proposals based on results.',
      cooked: '<p>Good question. The 10% increase is modest and we can always adjust in future proposals based on results.</p>',
      postNumber: 4,
      postType: PostType.REGULAR,
    },
  });

  // Add votes for proposal 1
  await prisma.vote.createMany({
    data: [
      {
        proposalId: proposal1.id,
        voter: whaleUser.address,
        voterSig: 'vote-sig-1',
        choice: 0, // For
        votingPower: BigInt('10000000000000'),
      },
      {
        proposalId: proposal1.id,
        voter: devUser.address,
        voterSig: 'vote-sig-2',
        choice: 0, // For
        votingPower: BigInt('5000000000000'),
      },
      {
        proposalId: proposal1.id,
        voter: newbieUser.address,
        voterSig: 'vote-sig-3',
        choice: 1, // Against
        votingPower: BigInt('3000000000000'),
      },
      {
        proposalId: proposal1.id,
        voter: 'bc1qrandomvoter44444444444',
        voterSig: 'vote-sig-4',
        choice: 2, // Abstain
        votingPower: BigInt('500000000000'),
      },
    ],
  });

  // Proposal 2: Another active proposal
  const proposal2 = await prisma.proposal.create({
    data: {
      title: 'Add BTC/USDT trading pair to the DEX',
      body: `Proposal to add a new BTC/USDT trading pair to the Alkanes DEX.

## Benefits

- Increased trading options for users
- More volume potential
- Better user experience for stablecoin traders

## Technical Considerations

The pool would be created using the standard AMM factory contract.`,
      choices: ['Approve', 'Reject'],
      author: devUser.address,
      authorSig: 'mock-sig-proposal-2',
      snapshot: 849500,
      start: new Date(now.getTime() - dayMs * 3),
      end: new Date(now.getTime() + dayMs * 4),
      state: ProposalState.ACTIVE,
      scores: JSON.stringify(['25000000000000', '2000000000000']),
      totalVotes: BigInt('27000000000000'),
    },
  });

  const discussion2 = await prisma.discussion.create({
    data: {
      title: '[Proposal] Add BTC/USDT trading pair',
      slug: 'proposal-add-btc-usdt-pair',
      author: devUser.address,
      categoryId: governanceCat.id,
      proposalId: proposal2.id,
      type: DiscussionType.PROPOSAL,
      postsCount: 2,
      viewsCount: 456,
      lastPostAt: new Date(now.getTime() - dayMs),
      bumpedAt: new Date(now.getTime() - dayMs),
    },
  });

  await prisma.post.create({
    data: {
      discussionId: discussion2.id,
      author: devUser.address,
      raw: proposal2.body,
      cooked: `<p>${proposal2.body.replace(/\n/g, '</p><p>')}</p>`,
      postNumber: 1,
      postType: PostType.REGULAR,
    },
  });

  await prisma.post.create({
    data: {
      discussionId: discussion2.id,
      author: whaleUser.address,
      raw: 'Makes sense to expand trading pairs. USDT has good liquidity across chains.',
      cooked: '<p>Makes sense to expand trading pairs. USDT has good liquidity across chains.</p>',
      postNumber: 2,
      postType: PostType.REGULAR,
    },
  });

  await prisma.vote.createMany({
    data: [
      {
        proposalId: proposal2.id,
        voter: whaleUser.address,
        voterSig: 'vote-sig-5',
        choice: 0,
        votingPower: BigInt('15000000000000'),
      },
      {
        proposalId: proposal2.id,
        voter: devUser.address,
        voterSig: 'vote-sig-6',
        choice: 0,
        votingPower: BigInt('10000000000000'),
      },
      {
        proposalId: proposal2.id,
        voter: newbieUser.address,
        voterSig: 'vote-sig-7',
        choice: 1,
        votingPower: BigInt('2000000000000'),
      },
    ],
  });

  // Proposal 3: Pending proposal
  const proposal3 = await prisma.proposal.create({
    data: {
      title: 'Community treasury allocation Q1 2025',
      body: `Quarterly proposal for community treasury spending allocation.

## Options

- **Option A (60/40):** 60% development, 40% marketing
- **Option B (70/30):** 70% development, 30% marketing
- **Option C (50/50):** Equal split between development and marketing

## Current Treasury Balance

Approximately 10M DIESEL tokens.`,
      choices: ['Option A: 60/40 Split', 'Option B: 70/30 Split', 'Option C: 50/50 Split'],
      author: adminUser.address,
      authorSig: 'mock-sig-proposal-3',
      snapshot: 848000,
      start: new Date(now.getTime() + dayMs * 2), // Starts in 2 days
      end: new Date(now.getTime() + dayMs * 9),
      state: ProposalState.PENDING,
      scores: JSON.stringify(['0', '0', '0']),
      totalVotes: BigInt(0),
    },
  });

  const discussion3 = await prisma.discussion.create({
    data: {
      title: '[Proposal] Community treasury allocation Q1 2025',
      slug: 'proposal-treasury-allocation-q1-2025',
      author: adminUser.address,
      categoryId: governanceCat.id,
      proposalId: proposal3.id,
      type: DiscussionType.PROPOSAL,
      postsCount: 1,
      viewsCount: 89,
      lastPostAt: new Date(now.getTime() - dayMs),
      bumpedAt: new Date(now.getTime() - dayMs),
    },
  });

  await prisma.post.create({
    data: {
      discussionId: discussion3.id,
      author: adminUser.address,
      raw: proposal3.body,
      cooked: `<p>${proposal3.body.replace(/\n/g, '</p><p>')}</p>`,
      postNumber: 1,
      postType: PostType.REGULAR,
    },
  });

  // Proposal 4: Closed proposal
  const proposal4 = await prisma.proposal.create({
    data: {
      title: 'Protocol fee reduction from 0.3% to 0.25%',
      body: 'Proposal to reduce trading fees from 0.3% to 0.25% to remain competitive with other DEXs.',
      choices: ['Yes', 'No'],
      author: devUser.address,
      authorSig: 'mock-sig-proposal-4',
      snapshot: 845000,
      start: new Date(now.getTime() - dayMs * 14),
      end: new Date(now.getTime() - dayMs * 7),
      state: ProposalState.CLOSED,
      scores: JSON.stringify(['45000000000000', '12000000000000']),
      totalVotes: BigInt('57000000000000'),
    },
  });

  const discussion4 = await prisma.discussion.create({
    data: {
      title: '[Proposal] Protocol fee reduction',
      slug: 'proposal-fee-reduction',
      author: devUser.address,
      categoryId: governanceCat.id,
      proposalId: proposal4.id,
      type: DiscussionType.PROPOSAL,
      postsCount: 3,
      viewsCount: 678,
      lastPostAt: new Date(now.getTime() - dayMs * 7),
      bumpedAt: new Date(now.getTime() - dayMs * 7),
    },
  });

  await prisma.post.create({
    data: {
      discussionId: discussion4.id,
      author: devUser.address,
      raw: proposal4.body,
      cooked: `<p>${proposal4.body}</p>`,
      postNumber: 1,
      postType: PostType.REGULAR,
    },
  });

  // Create some general discussions
  console.log('  Creating general discussions...');

  const welcomeDiscussion = await prisma.discussion.create({
    data: {
      title: 'Welcome to the Alkanes community!',
      slug: 'welcome-to-alkanes',
      author: adminUser.address,
      categoryId: generalCat.id,
      type: DiscussionType.GENERAL,
      isPinned: true,
      postsCount: 3,
      viewsCount: 1234,
      lastPostAt: new Date(now.getTime() - 1800000),
      bumpedAt: new Date(now.getTime() - 1800000),
    },
  });

  await prisma.post.create({
    data: {
      discussionId: welcomeDiscussion.id,
      author: adminUser.address,
      raw: `Welcome to the Alkanes community forum! This is a place to discuss governance proposals, share ideas, and connect with other DIESEL holders.

## Forum Guidelines

1. Be respectful and constructive
2. Stay on topic
3. No spam or self-promotion
4. Use appropriate categories for your posts

We're excited to have you here!`,
      cooked: `<p>Welcome to the Alkanes community forum!</p>`,
      postNumber: 1,
      postType: PostType.REGULAR,
    },
  });

  await prisma.post.create({
    data: {
      discussionId: welcomeDiscussion.id,
      author: newbieUser.address,
      raw: 'Thanks for the welcome! Excited to be part of this community.',
      cooked: '<p>Thanks for the welcome! Excited to be part of this community.</p>',
      postNumber: 2,
      postType: PostType.REGULAR,
    },
  });

  await prisma.post.create({
    data: {
      discussionId: welcomeDiscussion.id,
      author: devUser.address,
      raw: 'Great to see the forum up and running. Looking forward to great discussions!',
      cooked: '<p>Great to see the forum up and running. Looking forward to great discussions!</p>',
      postNumber: 3,
      postType: PostType.REGULAR,
    },
  });

  // Development discussion
  const devDiscussion = await prisma.discussion.create({
    data: {
      title: 'Getting started with Alkanes smart contracts',
      slug: 'getting-started-alkanes-contracts',
      author: devUser.address,
      categoryId: devCat.id,
      type: DiscussionType.GENERAL,
      postsCount: 2,
      viewsCount: 156,
      lastPostAt: new Date(now.getTime() - dayMs * 2),
      bumpedAt: new Date(now.getTime() - dayMs * 2),
    },
  });

  await prisma.post.create({
    data: {
      discussionId: devDiscussion.id,
      author: devUser.address,
      raw: `I've put together a quick guide for anyone wanting to start developing smart contracts on Alkanes.

## Prerequisites

- Rust installed
- Basic understanding of Bitcoin transactions

## Quick Start

1. Install the Alkanes CLI
2. Create a new project
3. Write your contract in Rust
4. Compile to WASM
5. Deploy to Bitcoin

Check out the docs for more details!`,
      cooked: '<p>Quick guide for developing on Alkanes...</p>',
      postNumber: 1,
      postType: PostType.REGULAR,
    },
  });

  await prisma.post.create({
    data: {
      discussionId: devDiscussion.id,
      author: newbieUser.address,
      raw: 'This is super helpful, thanks! Do you have any example projects I can look at?',
      cooked: '<p>This is super helpful, thanks! Do you have any example projects I can look at?</p>',
      postNumber: 2,
      postType: PostType.REGULAR,
    },
  });

  // Question discussion
  const questionDiscussion = await prisma.discussion.create({
    data: {
      title: 'How does DIESEL voting power work?',
      slug: 'how-diesel-voting-power-works',
      author: newbieUser.address,
      categoryId: generalCat.id,
      type: DiscussionType.QUESTION,
      postsCount: 2,
      viewsCount: 89,
      lastPostAt: new Date(now.getTime() - dayMs * 3),
      bumpedAt: new Date(now.getTime() - dayMs * 3),
    },
  });

  await prisma.post.create({
    data: {
      discussionId: questionDiscussion.id,
      author: newbieUser.address,
      raw: 'Can someone explain how voting power is calculated? Is it 1 DIESEL = 1 vote?',
      cooked: '<p>Can someone explain how voting power is calculated? Is it 1 DIESEL = 1 vote?</p>',
      postNumber: 1,
      postType: PostType.REGULAR,
    },
  });

  await prisma.post.create({
    data: {
      discussionId: questionDiscussion.id,
      author: whaleUser.address,
      raw: `Yes, voting power is directly proportional to your DIESEL holdings. 1 DIESEL = 1 vote.

The snapshot is taken at a specific block height when the proposal is created, so you need to hold DIESEL before the proposal starts to participate.

You can also delegate your voting power to another address if you want someone else to vote on your behalf.`,
      cooked: '<p>Yes, voting power is directly proportional to your DIESEL holdings...</p>',
      postNumber: 2,
      postType: PostType.REGULAR,
    },
  });

  // Add discussion participants
  console.log('  Creating discussion participants...');
  for (const discussion of [discussion1, discussion2, discussion3, welcomeDiscussion, devDiscussion, questionDiscussion]) {
    const posts = await prisma.post.findMany({ where: { discussionId: discussion.id } });
    const authors = [...new Set(posts.map(p => p.author))];

    for (const author of authors) {
      const authorPosts = posts.filter(p => p.author === author);
      await prisma.discussionParticipant.create({
        data: {
          discussionId: discussion.id,
          user: author,
          postsCount: authorPosts.length,
          notificationLevel: author === discussion.author ? NotificationLevel.WATCHING : NotificationLevel.TRACKING,
        },
      });
    }
  }

  // Add some reactions
  console.log('  Adding reactions...');
  const firstPosts = await prisma.post.findMany({ where: { postNumber: 1 }, take: 3 });
  for (const post of firstPosts) {
    await prisma.reaction.create({
      data: {
        postId: post.id,
        user: whaleUser.address,
        type: ReactionType.LIKE,
      },
    });
  }

  // Update post counts
  console.log('  Updating user post counts...');
  const userAddresses = [adminUser.address, whaleUser.address, devUser.address, newbieUser.address];
  for (const address of userAddresses) {
    const postCount = await prisma.post.count({ where: { author: address } });
    const discussionCount = await prisma.discussion.count({ where: { author: address } });
    await prisma.userProfile.update({
      where: { address },
      data: { postsCount: postCount, discussionsCount: discussionCount },
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`   - ${await prisma.category.count()} categories`);
  console.log(`   - ${await prisma.proposal.count()} proposals`);
  console.log(`   - ${await prisma.discussion.count()} discussions`);
  console.log(`   - ${await prisma.post.count()} posts`);
  console.log(`   - ${await prisma.vote.count()} votes`);
  console.log(`   - ${await prisma.userProfile.count()} user profiles`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
