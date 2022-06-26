/* Users collection sample */
const USERS = [
  {
    id: 1,
    email: "a@aaa.aaa",
    password: "$2y$10$mj1OMFvVmGAR4gEEXZGtA.R5wYWBZTis72hSXzpxEs.QoXT3ifKSq", // password
    createdAt: "2020-06-14 18:23:45",
  },
  {
    id: 2,
    email: "example2@example.com",
    password: "$2y$10$mj1OMFvVmGAR4gEEXZGtA.R5wYWBZTis72hSXzpxEs.QoXT3ifKSq", // password
    createdAt: "2020-06-14 18:23:45",
  },
  {
    id: 3,
    email: "example3@example.com",
    password: "$2y$10$mj1OMFvVmGAR4gEEXZGtA.R5wYWBZTis72hSXzpxEs.QoXT3ifKSq", // password
    createdAt: "2020-06-14 18:23:45",
  },
  {
    id: 4,
    email: "example4@example.com",
    password: "$2y$10$mj1OMFvVmGAR4gEEXZGtA.R5wYWBZTis72hSXzpxEs.QoXT3ifKSq", // password
    createdAt: "2020-06-14 18:23:45",
  },
];

const getUser = (key: string, value: string) =>
  USERS.find((user: { [key: string]: any }) => user[key] === value);

export const getUserDataById = (id: string) => getUser("id", id);
export const getUserDataByEmail = (email: string) => getUser("email", email);
