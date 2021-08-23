// Dynamically laod all the entities

import fs from 'fs'

export default async function (): Promise<any> {
    return Promise.all(
        // Read all files inside the folder
        fs.readdirSync(__dirname).filter((resolver: String) => resolver != "index.js" && !resolver.includes('.map')) // Filter out index.ts & .map files
                                 // Dynamically import entitites from path
                                 .map(async (entity: String) => {
                                     return (await import(`./${entity.substr(0, entity.indexOf('.'))}`)).default
                                 })
    )
}