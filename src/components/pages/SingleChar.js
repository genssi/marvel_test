import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import useMarvelService from "../../services/MarvelService";
import AppBanner from "../appBanner/AppBanner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import "./singleChar.scss";

const SingleChar = () => {
    const { charID } = useParams();
    const [char, setChar] = useState(null);
    const { loading, error, getCharacter, clearError } = useMarvelService();

    useEffect(() => {
        updateCharPage();
    }, [charID]);

    const updateCharPage = () => {
        clearError();
        getCharacter(charID).then(onCharLoaded);
    };

    const onCharLoaded = (char) => {
        setChar(char);
    };

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !char) ? (
        <View char={char} />
    ) : null;

    return (
        <>
            {errorMessage}
            {spinner}
            {content}
        </>
    );
}

const View = ({ char }) => {
    const { name, description, thumbnail } = char;
    return (
        <>
            <Helmet>
                <title>{name}</title>
                <meta name="description" content={`${name} information`}/>
            </Helmet>
            <AppBanner title={name} />
            <div className="single-char">
                <img src={thumbnail} alt={name} className="single-char__img" />
                <div className="single-char__info">
                    <h2 className="single-char__name">{name}</h2>
                    <p className="single-char__descr">{description}</p>
                </div>
                <Link to="/" className="single-char__back">
                        Back to home page
                </Link>
            </div>
        </>
    );
};

export default SingleChar;