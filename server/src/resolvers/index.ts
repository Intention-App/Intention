// Dynamically laod all the resolvers

import fs from 'fs'

export default async function (): Promise<any> {
    return Promise.all(
        // Read all files inside the folder
        fs.readdirSync(__dirname).filter((resolver: String) => resolver != "index.js" && !resolver.includes('.map')) // Filter out index.ts & .map files
                                 // Dynamically import resolvers from path
                                 .map(async (resolver: String) => {
                                     return (await import(`./${resolver.substr(0, resolver.indexOf('.'))}`)).default
                                 })
    )
}