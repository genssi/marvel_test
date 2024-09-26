import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import './comicsList.scss';

const ComicsList = () => {
    const [comics, setComics] = useState([]);
    const [newComicsLoading, setNewComicsLoading] = useState(false);
    const [offset, setOffset] = useState(100);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

    const duration = 400;

    useEffect(() => {
        onRequest(offset, true);
    }, []);
    
    const onRequest = (offset, initial) => {
        initial ? setNewComicsLoading(false) : setNewComicsLoading(true);
        getAllComics(offset).then(onComicsListLoaded);
    };

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;

        if (newComicsList.length < 8) {
            ended = true;
        }

        setComics([...comics,...newComicsList]);
        setNewComicsLoading(false);
        setOffset(offset + 8);
        setComicsEnded(ended);
    };

    function renderComics(arr) {
        return (
            <TransitionGroup component="ul" className="comics__grid">
                {arr.map((item, i) => {
                    return (
                        <CSSTransition 
                        key={i} 
                        timeout={duration} 
                        classNames="fade_comic">
                            <li className="comics__item" key={i}>
                                <Link to={`/comics/${item.id}`}>
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        className='comics__item-img'
                                    />
                                    <div className='comics__item-name'>{item.title}</div>
                                    <div className="comics__item-price">{item.price}</div>
                                </Link>
                            </li>
                        </CSSTransition>
                    );
                })}
            </TransitionGroup>
        )
    }

    const items = renderComics(comics);
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading || newComicsLoading ? <Spinner /> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {items}
            {spinner}
            <button 
                className="button button__main button__long"
                disabled={newComicsLoading}
                style={{ display: comicsEnded ? "none" : "block" }}
                onClick={() => onRequest(offset)}
                >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;