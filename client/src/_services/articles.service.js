import axios from "axios";

const API_URL = "http://127.0.0.1:8000/articles/";

const articleGetAll = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      }

    return axios.get(API_URL + "article/get-all/", {
        headers
    });
}

const articleGet = (id) => {
    const user = JSON.parse(localStorage.getItem("user"))
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      }
    return axios.get(API_URL + "article/get/" + id + "/",{
        headers
    });
}

const articlePost = (ArticleName, description, cards) => {
    const user = JSON.parse(localStorage.getItem("user"))
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      }
    return axios.post(API_URL + "article/post/", {
        ArticleName,
        description,
        cards
    }, {
        headers
    });
}

const cardGetAlllang = (card_id) => {
    const user = JSON.parse(localStorage.getItem("user"))
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      }
    return axios.get(API_URL + "card/get/" + card_id + "/", {
        headers
    });
}

const cardGetSpecificLang = (card_id) => {
    const user = JSON.parse(localStorage.getItem("user"))
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      }
    return axios.get(API_URL + "card/get/" + card_id + "/", {
        headers
    });
}

const cardPost = (cards, article_id) => {
    const user = JSON.parse(localStorage.getItem("user"))
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      }
    return axios.post(API_URL + "card/post/"+article_id+"/", {
        cards
    }, {
        headers
    });
}

const cardDelete = (card_id) => {
    const user = JSON.parse(localStorage.getItem("user"))
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      }
    return axios.delete(API_URL + "card/delete/"+card_id+"/", {
        headers
    });
}

const ArticleService = {
    articleGetAll,
    articleGet,
    articlePost,
    cardGetAlllang,
    cardGetSpecificLang,
    cardPost,
    cardDelete
}

export default ArticleService;