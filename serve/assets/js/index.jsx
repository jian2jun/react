import { render, h, Fragment, createContext, useState, useEffect, useLayoutEffect, useMemo, useCallback, useContext, useRef, useImperativeHandle} from "../libs/react/index.js";

import jquery from "/@modules/jquery";
console.log(jquery("#root"));

const Context = createContext();

const A =  ({ref}, {component}) => {
    const {count, setCount} = useContext(Context);
    useImperativeHandle(ref, () => ({
        a: () => {
            console.log(999);
        }
    }), []);

    return (
        <div>
            <p>{count}</p>
            <button
                ref={component.btnRef}
                onClick={() => {
                    setCount(count + 1);
                }}
            >+</button>
        </div>
    );
};

const App = () => {
    const [count, setCount] = useState(0);
    const ref = useRef();

    useEffect(() => {
        console.log(ref);
        console.log(ref.current)
        ref.current.a()
    });

    return (
        <>
            <div>{count}</div>
            <button
                type="button"
                onClick={() => {
                    setCount(count + 1);
                }}
            >
                +
            </button>
            <Context.Provider
                value={{
                    count,
                    setCount
                }}
            >
                <A ref={ref} />
            </Context.Provider>
        </>
    )
};

render(<App />, document.getElementById("root"));
