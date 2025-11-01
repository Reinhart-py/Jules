module.exports = (addSession, startChecker, bulkMessage, importNumbers, exportResults, settings) => {
  setTimeout(() => {
    console.log('--- Starting Test Mode ---');
    // 1. Add Session
    addSession.test('test-session');

    setTimeout(() => {
      // 2. Import Numbers
      importNumbers.test('numbers.txt');

      setTimeout(() => {
        // 3. Start Checker
        startChecker.test('test-session', 100, 0);

        setTimeout(() => {
          // 4. Bulk Message
          bulkMessage.test('test-session', 'This is a test message.');

          setTimeout(() => {
            // 5. Export Results
            exportResults.test('results.csv', 'csv', 'all');

            setTimeout(() => {
              // 6. Settings
              settings.test('91', '10');

              setTimeout(() => {
                console.log('--- Test Mode Finished ---');
                setTimeout(() => process.exit(0), 2000);
              }, 2000);
            }, 2000);
          }, 2000);
        }, 5000); // Wait for checker to finish
      }, 2000);
    }, 2000);
  }, 1000);
};