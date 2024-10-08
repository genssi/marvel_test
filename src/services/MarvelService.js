import {useHttp} from '../hooks/http.hook';

const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=c5d6fc8b83116d92ed468ce36bac6c62';
    const _baseOffset = 210;

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    };

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    };

    const getCharacterByName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
        
        // Исправил: проверка, если персонаж не найден
        if (res.data.results.length > 0) {
            return _transformCharacter(res.data.results[0]);
        } else {
            return null; // Возвращаем null, если персонажа нет
        }
    }

    const getAllComics = async (offset = 0) => {
        const res = await request (`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_trasformComics);
    };

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _trasformComics(res.data.results[0]);
    };

    const _transformCharacter = (char) => {
        if (char.description.length > 400) {
            char.description = char.description.slice(0, 400) + '...';
        } else if (!char.description || char.description.length === 0) {
            char.description = 'NO DESCRIPTION AVAILABLE!';
        };

        return {
            id: char.id,
            name: char.name,
            description: char.description,
            thumbnail:char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items,
        };
    };

    const _trasformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || 'There is no description',
            pageCount: comics.pageCount ? `${comics.pageCount} pages` : 'No information about the number of pages',
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            language: comics.textObjects[0]?.language || "en-us",
            price: comics.prices[0].price ? `${comics.prices[0].price + '$'}` : 'not available',
        };
    };

    return {loading, error, getAllCharacters, getCharacter, clearError, getAllComics, getComic, getCharacterByName};
};

export default useMarvelService;