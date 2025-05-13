// entrypoints/example.ts
export default defineContentScript({
    registration: 'runtime',
    main(ctx) {
      console.log('Script was executed!');
      return 'Hello John!';
    },
  });