export function createEntityCache(cache, entity, methods, fragment, variables = {}, firstInList = false) {
    const fields = {};
    methods.forEach(method => fields[method] = existingRefs => {
        const newRef = cache.writeFragment({
            data: entity,
            fragment,
            variables: variables[method] || {}
        });
        return firstInList ? [newRef, ...existingRefs] : [...existingRefs, newRef];
    });
    cache.modify({fields});
}

export function updateEntityCache(cache, entity, fragment, data) {
    cache.writeFragment({
        id: cache.identify(entity),
        fragment,
        data
    });
}

export function removeEntityCache(cache, entity, methods) {
    const fields = {};
    methods.forEach(method => fields[method] = (existingRefs, {readField}) => {
        return existingRefs.filter(r => entity.id !== readField('id', r));
    });
    cache.modify({fields});
}
