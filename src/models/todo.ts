import { ITodo } from "../types/todo"
import { model, Schema } from "mongoose"

const todoSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },

        description: {
            type: String,
        },

        status: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    { timestamps: true }
)

export default model<ITodo>("Todo", todoSchema)