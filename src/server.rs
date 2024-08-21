use actix::*;
use rand::prelude::*;
use std::collections::HashMap;

#[derive(Message)]
#[rtype(result = "()")]
pub struct Message {
    pub word: String,
}

#[derive(Message)]
#[rtype(usize)]
pub struct Connect {
    pub addr: Recipient<Message>,
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct Disconnect {
    pub id: usize,
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct Request {
    pub id: usize,
    pub word: String,
    pub liar_word: String,
}

#[derive(Debug, Default)]
pub struct Server {
    sessions: HashMap<usize, Recipient<Message>>,
    admin: Option<usize>,
    id: usize,
}

impl Server {
    fn send(&self, req: Request) {
        let mut rng = rand::thread_rng();
        let mut addrs: Vec<_> = self
            .sessions
            .iter()
            .filter_map(|(id, addr)| {
                if Some(*id) == self.admin {
                    None
                } else {
                    Some(addr)
                }
            })
            .collect();
        addrs.shuffle(&mut rng);
        if let Some(addr) = addrs.pop() {
            addr.do_send(Message {
                word: req.liar_word,
            });
        }
        for addr in addrs {
            addr.do_send(Message {
                word: req.word.clone(),
            });
        }
    }
}

impl Actor for Server {
    type Context = Context<Self>;
}

impl Handler<Connect> for Server {
    type Result = usize;

    fn handle(&mut self, msg: Connect, _: &mut Context<Self>) -> Self::Result {
        let id = self.id;
        println!("connected {}", id);
        self.id += 1;
        self.sessions.insert(id, msg.addr);
        id
    }
}

impl Handler<Disconnect> for Server {
    type Result = ();

    fn handle(&mut self, msg: Disconnect, _: &mut Context<Self>) {
        println!("disconnected {}", msg.id);
        self.sessions.remove(&msg.id);
    }
}

impl Handler<Request> for Server {
    type Result = ();

    fn handle(&mut self, msg: Request, _: &mut Context<Self>) {
        println!("admin {}", msg.id);
        self.admin = Some(msg.id);
        self.send(msg);
    }
}
