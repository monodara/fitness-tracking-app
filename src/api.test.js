import getFoodList from './api';

test('egg should be eggs', () => {
    expect(getFoodList('eggs')).toBe('eggs');
});
