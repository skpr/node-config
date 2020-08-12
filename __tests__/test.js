import skprConfig from "../index"

test('loads config', () => {
    let config = skprConfig(__dirname + '/fixtures/config.json')
    expect(config.foo).toBe("bar")
    expect(config.wiz).toBe("bang")
    expect(process.env['FOO']).toBe("bar")
    expect(process.env['WIZ']).toBe("bang")
});
