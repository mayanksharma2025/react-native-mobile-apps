import * as yup from "yup";

export const taskValidator = yup.object({
    title: yup.string().required().min(3),
    description: yup.string().max(500),
    priority: yup.string().oneOf(["low", "medium", "high"]).required(),
});

export const projectValidator = yup.object({
    name: yup.string().required().min(3),
    description: yup.string().max(500),
});
