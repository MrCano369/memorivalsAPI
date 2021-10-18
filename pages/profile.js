import { useState } from "react";
import Layout from "../components/Layout";
import setTitle from "../hooks/setTitle";
import { withProtect } from "../lib/protect";
import { getVictories } from "../lib/userData";

export default function profile({ user }) {
  const { name, profileImg, victories } = user;
  setTitle("Mi perfil");
  const [avatar, setAvatar] = useState(profileImg);

  var avatars = [
    "UI_AvatarIcon_Albedo.png",
    "UI_AvatarIcon_Ambor.png",
    "UI_AvatarIcon_Ayaka.png",
    "UI_AvatarIcon_Barbara.png",
    "UI_AvatarIcon_Beidou.png",
    "UI_AvatarIcon_Bennett.png",
    "UI_AvatarIcon_Chongyun.png",
    "UI_AvatarIcon_Diluc.png",
    "UI_AvatarIcon_Diona.png",
    "UI_AvatarIcon_Eula.png",
    "UI_AvatarIcon_Feiyan.png",
    "UI_AvatarIcon_Fischl.png",
    "UI_AvatarIcon_Ganyu.png",
    "UI_AvatarIcon_Hutao.png",
    "UI_AvatarIcon_Kaeya.png",
    "UI_AvatarIcon_Kazuha.png",
    "UI_AvatarIcon_Keqing.png",
    "UI_AvatarIcon_Klee.png",
    "UI_AvatarIcon_Lisa.png",
    "UI_AvatarIcon_Mona.png",
    "UI_AvatarIcon_Ningguang.png",
    "UI_AvatarIcon_Noel.png",
    "UI_AvatarIcon_PlayerBoy.png",
    "UI_AvatarIcon_PlayerGirl.png",
    "UI_AvatarIcon_Qiqi.png",
    "UI_AvatarIcon_Razor.png",
    "UI_AvatarIcon_Rosaria.png",
    "UI_AvatarIcon_Sara.png",
    "UI_AvatarIcon_Sayu.png",
    "UI_AvatarIcon_Shougun.png",
    "UI_AvatarIcon_Sucrose.png",
    "UI_AvatarIcon_Tartaglia.png",
    "UI_AvatarIcon_Venti.png",
    "UI_AvatarIcon_Xiangling.png",
    "UI_AvatarIcon_Xiao.png",
    "UI_AvatarIcon_Xingqiu.png",
    "UI_AvatarIcon_Xinyan.png",
    "UI_AvatarIcon_Yoimiya.png",
    "UI_AvatarIcon_Zhongli.png",
  ];

  const saveAvatar = async (avatar) => {
    const res = await fetch("/api/setAvatar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar }),
    }).then((r) => r.json());
    if (res.err) return console.log(res.err);
    setAvatar(avatar);
  };

  return (
    <Layout>
      <div className="has-text-centered">
        <img src={`images/Avatars/${avatar}`} className="myAvatar" />
        <p className="title">{name}</p>
        <p className="subtitle">&#x1f3c6;{victories}</p>
        {/* <p className="subtitle">Coins: 5400</p> */}

        <hr />
        <div className="avatarsContainer">
          {avatars.map((img) => (
            <img
              key={img}
              src={`images/Avatars/${img}`}
              onClick={() => saveAvatar(img)}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = withProtect(getVictories);
