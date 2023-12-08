import Client from "../models/clientModel.js";
import asyncHandler from "express-async-handler";

const clientRegister = asyncHandler(async (req, res) => {
  const { name, email, url, status, tasks, description, contact } = req.body;

  const clientExists = await Client.findOne({ email });
  if (clientExists) {
    res.status(404);
    throw new Error("Client already exists");
  }

  const client = await Client.create({
    name,
    url,
    email,
    status,
    tasks,
    description,
    contact,
  });
  if (client) {
    res.status(201).json({
      name: client.name,
      email: client.email,
      url: client.url,
      status: client.status,
      tasks: client.tasks,
      description: client.description,
      contact: client.contact,
    });
  } else {
    res.status(400);
    throw new Error("Invalid client data");
  }
});

const getClients = asyncHandler(async (req, res) => {
  const clients = await Client.find({ user: req.params.id });
  res.json(clients);

  if (clients) {
    res.status(200);
    throw new Error("Get all clients to this user");
  } else {
    res.status(400);
    throw new Error("Invalid client data");
  }
});
const updateClient = asyncHandler(async (req, res) => {
  console.log(req.body);
  try {
    const { name, email, url, status, tasks, description, contact, id } =
      await req.body;
    const updatedClient = await Client.findOneAndUpdate(
      { _id: id },
      { name, email, url, status, tasks, description, contact },
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Do not update", updatedClient });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const deleteClient = asyncHandler(async (req, res) => {
  const { _id} = await req.body;

  try {
    const deletedClient = await Client.findByIdAndDelete(_id);
    if (!deletedClient)
      return res.status(404).json({ message: "Client not found" });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export { clientRegister, getClients, updateClient, deleteClient };
