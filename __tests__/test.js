import skprConfig from "../src/index"

test('loads config', () => {
    let config = skprConfig(__dirname + '/fixtures/config.json')
    expect(config.foo).toBe("bar")
    expect(config.wiz).toBe("bang")
    expect(config['pop-fiz']).toBe("whoop")
    expect(process.env['FOO']).toBe("bar")
    expect(process.env['WIZ']).toBe("bang")
    expect(process.env['POP_FIZ']).toBe("whoop")
});
