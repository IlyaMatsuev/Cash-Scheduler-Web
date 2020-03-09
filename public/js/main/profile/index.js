$(() => {
    checkPageAccess()
        .then(access => {
            if (access) {
                appearBodySlowly();
            }
        });
});
