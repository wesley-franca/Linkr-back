import connection from "../database/Postgres.js";
import * as postsRepository from "../repositories/Posts.repository.js";
import urlMetadata from "url-metadata";
import { STATUS_CODE } from "../enums/statusCode.js";
import {
  insertPost,
  insertPostHashtag,
} from "../repositories/Hashtags.repository.js";

const postUrl = async (req, res) => {
  const { url, description } = req.body;
  const { userId } = res.locals;
  const hashtagsArray = res.locals.hashtags;

  try {
    await postsRepository.postUrl(url, description, userId);
    const id = await insertPost({ description, url, userId });
    if (hashtagsArray.length > 0) {
      for (let i = 0; i < hashtagsArray.length; i++) {
        let hashtagId = await connection.query(
          `SELECT id FROM ${TABLE_HASHTAG} WHERE hashtag = $1;`,
          [hashtagsArray[i]]
        );
        hashtagId = hashtagId.rows[0].id;
        await insertPostHashtag({ id, hashtagId });
      }
    }
    res.sendStatus(STATUS_CODE.CREATED);
  } catch (error) {
    return res.status(STATUS_CODE.SERVER_ERROR).send(error.message);
  }
};

const getPosts = async (req, res) => {
  try {
    //const result = await postsRepository.getPosts();

    const result = [
      {
        link: "https://www.globo.com/",
        description: "Description",
        user: {
          name: "Neytiri",
          picture:
            "https://conteudo.imguol.com.br/c/entretenimento/80/2017/04/25/a-atriz-zoe-saldana-como-neytiri-em-avatar-1493136439818_v2_4x3.jpg",
        },
        createdAt: "10/04/2021",
      },
      {
        link: "https://www.globo.com/",
        description: "Description",
        user: {
          name: "Aang",
          picture:
            "https://upload.wikimedia.org/wikipedia/pt/8/86/Avatar_Aang.png",
        },
        createdAt: "25/11/2020",
      },
    ];

    const posts = await getMetadatas(result);

    res.status(200).send(posts);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getMetadatas = async (result) => {
  try {
    const posts = await Promise.all(
      result.map(async (post) => {
        const metadata = await urlMetadata(post.link);

        const info = {
          url: metadata.url,
          title: metadata.title,
          description: metadata.description,
          image: metadata.image,
        };

        return { ...post, link: info };
      })
    );

    return posts;
  } catch (error) {
    return console.log(error.message);
  }
};

export { postUrl, getPosts };
