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

        priority: {
            type: Number,
            required: true,
            default: 1,
        },
    },
    { timestamps: true }
)

export default model<ITodo>("Todo", todoSchema)