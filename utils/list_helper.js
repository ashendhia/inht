const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = (blogs) => {
    let mostLikedBlog = {
        likes: -1
    }
    for (let blog of blogs) {
        mostLikedBlog = mostLikedBlog.likes < blog.likes
            ? blog
            : mostLikedBlog
    }

    if (blogs.length === 0) {
        return undefined
    }
    return {
        title: mostLikedBlog.title,
        author: mostLikedBlog.author,
        likes: mostLikedBlog.likes
    }
}

const mostBlogs = (blogs) => {
    var blogsMap = new Map()
    for (let blog of blogs) {
        if (blogsMap.get(blog.author)) {
            blogsMap.set(blog.author, blogsMap.get(blog.author) + 1)
        } else {
            blogsMap.set(blog.author, 1)
        }
    }
    const iterator1 = blogsMap[Symbol.iterator]();
    let authorMostBlogs = ["",-1]
    for (const author of iterator1) {
        if (author[1] > authorMostBlogs[1]) {
            authorMostBlogs[0] = author[0]
            authorMostBlogs[1] = author[1]
        }
    }
    if (blogs.length === 0) {
        return undefined
    }
    return {
        author: authorMostBlogs[0],
        blogs: authorMostBlogs[1]
    }
}

const mostLikes = (blogs) => {
    var blogsMap = new Map()
    for (let blog of blogs) {
        if (blogsMap.get(blog.author)) {
            blogsMap.set(blog.author, blogsMap.get(blog.author) + blog.likes)
        } else {
            blogsMap.set(blog.author, blog.likes)
        }
    }
    const iterator1 = blogsMap[Symbol.iterator]();
    let authorMostLikes = ["",-1]
    for (const author of iterator1) {
        if (author[1] > authorMostLikes[1]) {
            authorMostLikes[0] = author[0]
            authorMostLikes[1] = author[1]
        }
    }
    if (blogs.length === 0) {
        return undefined
    }
    return {
        author: authorMostLikes[0],
        likes: authorMostLikes[1]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}