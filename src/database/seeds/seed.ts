import dataSource from '../data-source.js';
import { Subscriptions } from '../../subscriptions/entities/subscriptions.entity.js';
import { createSubscriptionSeeds } from './subscriptions.seed.js';

async function seed(): Promise<void> {
  await dataSource.initialize();

  try {
    const subscriptions = createSubscriptionSeeds();

    await dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Subscriptions);

      for (const subscription of subscriptions) {
        const existing = await repository.findOne({
          where: { name: subscription.name },
        });

        await repository.save(
          repository.create({
            ...existing,
            ...subscription,
          }),
        );
      }
    });

    console.log(`${subscriptions.length} abonnements ont été créés ou mis à jour.`);
  } finally {
    await dataSource.destroy();
  }
}

seed().catch((error: unknown) => {
  console.error('Impossible de créer les données de démonstration.', error);
  process.exitCode = 1;
});
