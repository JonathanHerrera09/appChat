const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const usersFilePath = path.join(__dirname, 'users.json');
const chatsFilePath  = path.join(__dirname, 'chats.json');
const messagesFilePath  = path.join(__dirname, 'messages.json');

app.post('/api/users/login', (req, res) => {
  const { phoneNumber } = req.body;
  fs.readFile(usersFilePath, (err, data) => {
    if (err) {
      res.status(500).send('Error reading users file');
    } else {
      const users = JSON.parse(data);
      if (users.includes(phoneNumber)) {
        res.send({ message: 'Login successful' });
      } else {
        users.push(phoneNumber);
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (writeErr) => {
          if (writeErr) {
            res.status(500).send('Error writing to users file');
          } else {
            res.send({ message: 'Ok' });
          }
        });
      }
    }
  });
});
app.post('/api/users', (req, res) => {
    const { phoneNumber } = req.body;
    fs.readFile(usersFilePath, (err, data) => {
      if (err) {
        res.status(500).send('Error reading users file');
      } else {
        const users = JSON.parse(data);
        if (users.includes(phoneNumber)) {
            updateUserChats(phoneNumber, res);
        } else {
            res.send({ message: 'Danger' });
        }
      }
    });
  });
app.get('/api/chats', (req, res) => {
    fs.readFile(chatsFilePath, (err, data) => {
      if (err) {
        res.status(500).send('Error reading chats file');
      } else {
        const chats = JSON.parse(data);
        res.send(chats);
      }
    });
});
app.get('/api/messages', (req, res) => {
    fs.readFile(messagesFilePath, (err, data) => {
      if (err) {
        res.status(500).send('Error reading chats file');
      } else {
        const msg = JSON.parse(data);
        res.send(msg);
      }
    });
});
app.post('/api/chatsNew', (req, res) => {
    const newChat = req.body;
    fs.readFile(chatsFilePath, (err, data) => {
      if (err) {
        res.status(500).send('Error reading chats file');
      } else {
        let chats = JSON.parse(data);
        if (!Array.isArray(chats)) {
          chats = [];
        }
        chats.push(newChat);
        fs.writeFile(chatsFilePath, JSON.stringify(chats, null, 2), (writeErr) => {
          if (writeErr) {
            res.status(500).send('Error writing to chats file');
          } else {
            res.send({ message: 'Chat added successfully' });
          }
        });
      }
    });
  });

  app.post('/api/MsgNew', (req, res) => {
    const newChat = req.body;
    fs.readFile(messagesFilePath, (err, data) => {
        if (err) {
            res.status(500).send('Error reading chats file');
        } else {
            let chats = JSON.parse(data);
            if (!Array.isArray(chats)) {
                chats = [];
            }
            const index = chats.findIndex(chat => Object.keys(chat)[0] === Object.keys(newChat)[0]);
            if (index !== -1) {
                chats[index] = newChat;
            } else {
                chats.push(newChat);
            }
            fs.writeFile(messagesFilePath, JSON.stringify(chats, null, 2), (writeErr) => {
                if (writeErr) {
                    res.status(500).send('Error writing to chats file');
                } else {
                    updateChatsFile(newChat, res);
                }
            });
        }
    });
});
app.post('/api/chatsDel', (req, res) => {
  const { chatId, delField } = req.body;
  fs.readFile(messagesFilePath, (err, data) => {
    if (err) {
      return res.status(500).send('Error reading messages file');
    }
    let chats = JSON.parse(data);
    if (!Array.isArray(chats)) {
      chats = [];
    }

    // Encuentra y actualiza el campo del o del2 a 0 en el mensaje correspondiente
    const updatedChats = chats.map(chat => {
      if (chat[chatId]) {
        chat[chatId].message = chat[chatId].message.map(msg => {
          if (delField === 'del') {
            msg.del = 0;
          } else if (delField === 'del2') {
            msg.del2 = 0;
          }
          return msg;
        });
      }
      return chat;
    });
    fs.writeFile(messagesFilePath, JSON.stringify(updatedChats, null, 2), (writeErr) => {
      if (writeErr) {
        return res.status(500).send('Error writing to messages file');
      }
    });
  });

  fs.readFile(chatsFilePath, (err, data) => {
    if (err) {
      return res.status(500).send('Error reading chats file');
    }
    let chats = JSON.parse(data);
    if (!Array.isArray(chats)) {
      chats = [];
    }

    // Actualiza el valor del campo especificado a 0
    const updatedChats = chats.map(chat => {
      if (chat.id === chatId) {
        if (delField === 'del') {
          chat.del = 0;
        } else if (delField === 'del2') {
          chat.del2 = 0;
        }
      }
      return chat;
    });

    fs.writeFile(chatsFilePath, JSON.stringify(updatedChats, null, 2), (writeErr) => {
      if (writeErr) {
        return res.status(500).send('Error writing to chats file');
      }
      res.send({ message: 'Chat updated successfully', chats: updatedChats });
    });
  });
});
function updateUserChats(phone, res) {
  fs.readFile(chatsFilePath, (err, data) => {
    if (err) {
      console.error('Error reading chats file:', err);
      res.status(500).send('Error reading chats file');
      return;
    }

    let chats = JSON.parse(data);
    if (!Array.isArray(chats)) {
      chats = [];
    }
    
    const userChats = chats.filter(chat => {
      return chat.phoneNumber === phone || chat.mychat === phone;
    });
    /* console.log(chats);
    console.log(phone); */
    if (userChats.length === 0) {
      res.send({ message: 'No' });
    } else {
      res.send({ message: userChats });
    }
  });
}

function updateChatsFile(newChat, res) {
  fs.readFile(chatsFilePath, (err, data) => {
      if (err) {
          res.status(500).send('Error reading chats file');
      } else {
          const idChat = Object.keys(newChat)[0];
          let chats = JSON.parse(data);

          if (!Array.isArray(chats)) {
              chats = [];
          }

          const chatToUpdate = chats.find(chat => chat.id === idChat);

          if (chatToUpdate) {
              chatToUpdate.del = 1;
              chatToUpdate.del2 = 1;

              fs.writeFile(chatsFilePath, JSON.stringify(chats, null, 2), (writeErr) => {
                  if (writeErr) {
                      res.status(500).send('Error writing to chats file');
                  } else {
                      res.send({ message: 'Chats updated successfully' });
                  }
              });
          } else {
              res.status(404).send('Chat not found');
          }
      }
  });
}
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://192.168.18.8:${PORT}`);
});
