mergeInto(LibraryManager.library, {
    js_add: function(x, y) {
        console.log("this is in js");
        return x + y;
    },
});
