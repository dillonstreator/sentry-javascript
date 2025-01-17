import { conditionalTest } from '../../../utils';
import { createRunner } from '../../../utils/runner';

conditionalTest({ min: 14 })('GraphQL/Apollo Tests', () => {
  test('CJS - should instrument GraphQL queries used from Apollo Server.', done => {
    const EXPECTED_TRANSACTION = {
      transaction: 'Test Transaction',
      spans: expect.arrayContaining([
        expect.objectContaining({
          data: {
            'graphql.operation.type': 'query',
            'graphql.source': '{hello}',
            'otel.kind': 'INTERNAL',
            'sentry.origin': 'auto.graphql.otel.graphql',
          },
          description: 'query',
          status: 'ok',
          origin: 'auto.graphql.otel.graphql',
        }),
        expect.objectContaining({
          data: {
            'graphql.field.name': 'hello',
            'graphql.field.path': 'hello',
            'graphql.field.type': 'String',
            'graphql.source': 'hello',
            'otel.kind': 'INTERNAL',
            'sentry.origin': 'manual',
          },
          description: 'graphql.resolve',
          status: 'ok',
          origin: 'manual',
        }),
      ]),
    };

    createRunner(__dirname, 'scenario-query.js').expect({ transaction: EXPECTED_TRANSACTION }).start(done);
  });

  test('CJS - should instrument GraphQL mutations used from Apollo Server.', done => {
    const EXPECTED_TRANSACTION = {
      transaction: 'Test Transaction',
      spans: expect.arrayContaining([
        expect.objectContaining({
          data: {
            'graphql.operation.name': 'Mutation',
            'graphql.operation.type': 'mutation',
            'graphql.source': `mutation Mutation($email: String) {
  login(email: $email)
}`,
            'otel.kind': 'INTERNAL',
            'sentry.origin': 'auto.graphql.otel.graphql',
          },
          description: 'mutation Mutation',
          status: 'ok',
          origin: 'auto.graphql.otel.graphql',
        }),
      ]),
    };

    createRunner(__dirname, 'scenario-mutation.js').expect({ transaction: EXPECTED_TRANSACTION }).start(done);
  });
});
