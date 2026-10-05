import mongoose from 'mongoose'

// Sockets opened by an earlier instance of the Durable Object in this isolate are unusable, so every instance starts on a fresh connection.
const Reset = (): void => {
    const previous = mongoose.connection
    const connection = mongoose.createConnection()

    for (const model of Object.values(previous.models))
        model.useConnection(connection)

    mongoose.connections.pop()
    mongoose.connections[0] = connection
}

export default Reset