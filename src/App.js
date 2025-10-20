import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [name, setName] = useState("");
  const [img, setImg] = useState("https://i.pravatar.cc/48");
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selected, setSelected] = useState(null);
  function handleShow() {
    setShowAddFriend((prev) => !prev);
  }
  function handleSplit(value) {
    setFriends((prev) =>
      prev.map((friend) =>
        friend.id === selected.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          setSelected={setSelected}
          selected={selected}
          setShowAddFriend={setShowAddFriend}
        />
        {showAddFriend && (
          <FormAddFriend
            name={name}
            img={img}
            setName={setName}
            setImg={setImg}
            setFriends={setFriends}
            setShowAddFriend={setShowAddFriend}
          />
        )}
        <Button onClick={handleShow}>{`${
          showAddFriend ? "Close" : "Add Friend"
        }`}</Button>
      </div>
      {selected && (
        <FormSplitBill selected={selected} handleSplit={handleSplit} />
      )}
    </div>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FriendList({ friends, setSelected, selected, setShowAddFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          setSelected={setSelected}
          selected={selected}
          setShowAddFriend={setShowAddFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, setSelected, selected, setShowAddFriend }) {
  function handleSelected() {
    setSelected(selected?.id === friend.id ? null : friend);
    setShowAddFriend(false);
  }
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} Owes You {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are Even</p>}
      <Button onClick={handleSelected}>
        {selected?.id === friend.id ? "close" : "select"}
      </Button>
    </li>
  );
}

function FormAddFriend({
  name,
  img,
  setName,
  setImg,
  setFriends,
  setShowAddFriend,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    if (!name) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${img}?=${id}`,
      balance: 0,
    };
    setFriends((prev) => [...prev, newFriend]);
    setName("");
    setImg("https://i.pravatar.cc/48");
    setShowAddFriend(false);
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>📷Image Url</label>
      <input type="text" value={img} onChange={(e) => setImg(e.target.value)} />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selected, handleSplit }) {
  const [bill, setBill] = useState("");
  const [youPay, setYouPay] = useState("");
  const frndPay = bill ? bill - youPay : "";
  const [whoPays, setWhoPays] = useState("you");
  const name = selected.name;
  function handleSubmit(e) {
    e.preventDefault();
    handleSplit(whoPays === "you" ? frndPay : -youPay);
    setBill("");
    setYouPay("");
    setWhoPays("you");
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>{`Split a Bill with ${name},s`}</h2>
      <label htmlFor="bill">🤑Total Bill</label>
      <input
        type="text"
        name="bill"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label htmlFor="mine">😍Your Expense</label>
      <input
        type="text"
        name="mine"
        value={youPay}
        onChange={(e) =>
          setYouPay(
            Number(e.target.value) > bill ? youPay : Number(e.target.value)
          )
        }
      />
      <label htmlFor="other">{`🤡${name},s Expense`}</label>
      <input type="text" name="other" value={frndPay} disabled />
      <label htmlFor="opt">💸Who Pay,s the Bill</label>
      <select
        name="opt"
        value={whoPays}
        onChange={(e) => setWhoPays(e.target.value)}
      >
        <option value="you">You</option>
        <option value="other">{name}</option>
      </select>
      <Button>Add</Button>
    </form>
  );
}
