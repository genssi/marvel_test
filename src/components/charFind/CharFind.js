import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import useMarvelService from "../../services/MarvelService";
import "./charFind.scss";

const CharFind = () => {
    const [char, setChar] = useState(null);
    const [charNotFound, setCharNotFound] = useState(false);
    const { loading, getCharacterByName } = useMarvelService();

    const onCharLoaded = (char) => {
        setChar(char);
        setCharNotFound(false);
    };

    const onCharNotFound = () => {
        setChar(null);
        setCharNotFound(true);
    };

    const handleSubmit = ({ name }) => {
        setChar(null);
        setCharNotFound(false);

        getCharacterByName(name)
            .then(char => {
                if (char) {
                    onCharLoaded(char);
                } else {
                    onCharNotFound();
                }
            })
            .catch(() => onCharNotFound());
    };

    return (
        <>
            <Formik 
                initialValues={{
                    name: '',
                }}
                validationSchema={ Yup.object({
                    name: Yup.string()
                        .required('This field is required'),
                })}
                onSubmit={handleSubmit}>
                    <Form className="find">
                        <p className="text_find">Or find a character by name:</p>
                        <div className="find__char">
                            <Field 
                            id="name"
                            name="name"
                            type="text" 
                            placeholder="Enter name"
                            className="input_find" />
                            <div className="btn-find">
                                <button 
                                type="submit"
                                className="button button__main"
                                disabled={loading}>
                                    <div className="inner">FIND</div>
                                </button>
                            </div>
                            {char && (
                                <div className="success">
                                    There is! Visit {char.name} page?
                                </div>
                            )}
                            {char && (
                                <div className="btn-visit">
                                    <Link
                                        className="button button__secondary"
                                        to={`/characters/${char.id}`}
                                    >
                                        <div className="inner">TO PAGE</div>
                                    </Link>
                                </div>
                            )}
                            {charNotFound && (
                                <div className="error">
                                    The character was not found. Check the name and try again
                                </div>
                            )}
                        </div>
                        <ErrorMessage name="name" component="div" className="error" />
                    </Form>
            </Formik>
        </>
    )
}

export default CharFind;