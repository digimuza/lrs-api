import * as _path from 'path'


export namespace Root {
    const rootDir = __dirname
    export function path(...paths: string[]) {
        return _path.resolve(__dirname, ...paths)
    }
}
