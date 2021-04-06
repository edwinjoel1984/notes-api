const palindrome = (string) =>{
    return string.split("").reverse().join("");
};

const average = (array)=>{
    if(typeof array === "undefined") return 0;
    let sum = 0;
    array.forEach(element => {
        sum+=element;
    });
    return sum;
};

describe("Palindrome", ()=>{
    test.skip("first test", ()=>{
        const result = palindrome("edwin");
        expect(result).toBe("niwde");
    });
    test.skip("first empty", ()=>{
        const result = average();
        expect(result).toBe(0);
    });
});


