import React, { useState, useEffect, useRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import useMarvelService from "../../services/MarvelService";
import "./charList.scss";
import PropTypes from "prop-types";

const CharList = (props) => {
    const myRef = useRef([]);

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const { loading, error, getAllCharacters } = useMarvelService();

    const duration = 400;

    useEffect(() => {
        onRequest(offset, true);
    }, []); // пустой массив значит, что useEffect сработает лишь один раз.

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset).then(onCharListLoaded);
    };

    const onCharListLoaded = (newCharList) => {
        let ended = false;

        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList((charList) => [...charList, ...newCharList]);
        setNewItemLoading((newItemLoading) => false);
        setOffset((offset) => offset + 9);
        setCharEnded((charEnded) => ended);
    };

    const focusCharItem = (i) => {
        if (myRef[i].current) {
            myRef[i].current.style.boxShadow = "0 5px 20px #9F0013";
            myRef[i].current.style.transform = "translateY(-8px)";
        }
    };

    const unFocusCharItem = (i) => {
        if (myRef[i].current) {
            myRef[i].current.style.boxShadow = "none";
            myRef[i].current.style.transform = "none";
        }
    };

    const handleClick = (item, i) => {
        props.onCharSelected(item.id);
        focusCharItem(i);
    };

    // Этот метод создан для оптимизации,
    // чтобы не помещать такую конструкцию в метод render
    function renderItems(arr) {
        return (
            <TransitionGroup component="ul" className="char__grid">
                {arr.map((item, i) => {
                    let imgStyle = { objectFit: "cover" };
                    if (
                        item.thumbnail ===
                    "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
                    ) {
                        imgStyle = { objectFit: "unset" };
                    }
        
                    if (!myRef[i]) {
                        myRef[i] = React.createRef();
                    }
        
                    return (
                        <CSSTransition
                            key={item.id}
                            timeout={duration}
                            classNames="fade"
                        >
                            <li
                            className="char__item"
                            key={item.id}
                            ref={myRef[i]}
                            tabIndex={0}
                            onClick={() => handleClick(item, i)}
                            onFocus={() => focusCharItem(i)}
                            onBlur={() => unFocusCharItem(i)}
                            >
                                <img
                                    src={item.thumbnail}
                                    alt={item.name}
                                    style={imgStyle}
                                />
                                <div className="char__name">{item.name}</div>
                            </li>
                        </CSSTransition>
                    );
            })}
            </TransitionGroup>
        )
    }

    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading || newItemLoading ? <Spinner /> : null;

    return (
        <div className="char__list">
            {errorMessage}
            {items}
            {spinner}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{ display: charEnded ? "none" : "block" }}
                onClick={() => onRequest(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    );
};

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
