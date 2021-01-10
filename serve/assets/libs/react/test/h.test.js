import {h} from "../h";

test("sel", () => {
    expect(
        h("div")
    ).toEqual({
        sel: "div",
        children: [],
        data: {},
        text: undefined,
        key: undefined,
        elm: undefined
    });
});

test("sel + null", () => {
    expect(
        h("div", null)
    ).toEqual({
        sel: "div",
        children: [],
        data: {},
        text: undefined,
        key: undefined,
        elm: undefined
    });
});

test("sel + text", () => {
    expect(
        h("div", "text")
    ).toEqual({
        sel: "div",
        children: undefined,
        data: {},
        text: "text",
        key: undefined,
        elm: undefined
    });
});