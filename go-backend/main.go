package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

// Author sturct
type Author struct {
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Furigana  string `json:"furigana"`
    Romaji string `json:"romaji"`
    GraduationId int `json:"graduationId"`
    Generation int `json:"generation"`
    Profile Profile `json:"profile"`
    Blogs []Blog `json:"blogs"`
}

type Profile struct {
    Birthday string `json:"birthday"`
    Zodiac string `json:"zodiac"`
    Height string `json:"height"`
    From string `json:"from"`
    Blood string `json:"blood"`
}

// Blog struct
type Blog struct {
    ID      int    `json:"id"`
    Title   string `json:"title"`
    Content string `json:"content"`
    Date    string `json:"date"`
    Thumbnail string `json:"thumbnail"`
}

const dataDir = "./data"

// whithCORS returns a middleware that adds CORS headers to the given http.Handler.
func withCORS(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*") // allow requests from any origin
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
        
        // handle preflight requests
        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusOK)
            return
        }
        
        next.ServeHTTP(w, r)
    })
}


// authorsHandler returns a list of authors in the data directory.
func authorsHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")

    files, err := filepath.Glob(filepath.Join(dataDir, "*.json"))
    if err != nil {
        http.Error(w, "Could not read data directory", http.StatusInternalServerError)
        return
    }

    var authors []Author
    for _, file := range files {
        var author Author
        data, err := os.ReadFile(file)
        if err != nil {
            log.Printf("Could not read file %s: %v", file, err)
            continue
        }
        if err := json.Unmarshal(data, &author); err != nil {
            log.Printf("Could not unmarshal JSON from file %s: %v", file, err)
            continue
        }
        authors = append(authors, author)
    }

    if err := json.NewEncoder(w).Encode(authors); err != nil {
        http.Error(w, "Could not encode authors data", http.StatusInternalServerError)
    }
}



// blogsHandler: 特定の著者のブログ一覧を返す
func blogsHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")

    authorIDStr := strings.TrimPrefix(r.URL.Path, "/blogs/")
    authorID, err := strconv.Atoi(authorIDStr)
    if err != nil {
        http.Error(w, "Invalid author ID", http.StatusBadRequest)
        return
    }

    var author Author
    file := filepath.Join(dataDir, fmt.Sprintf("author%d.json", authorID))
    data, err := os.ReadFile(file)
    if err != nil {
        http.Error(w, "Could not read file", http.StatusInternalServerError)
        return
    }

    if err := json.Unmarshal(data, &author); err != nil {
        http.Error(w, "Could not unmarshal JSON", http.StatusInternalServerError)
        return
    }

    // Author名とBlogsリストを一緒に返す
    response := struct {
        Name  string `json:"name"`
        Furigana string `json:"furigana"`
        Profile Profile `json:"profile"`
        Blogs []Blog `json:"blogs"`
    }{
        Name:  author.Name,
        Furigana: author.Furigana,
        Profile: author.Profile,
        Blogs: author.Blogs,
    }

    if err := json.NewEncoder(w).Encode(response); err != nil {
        http.Error(w, "Could not encode blogs data", http.StatusInternalServerError)
    }

}

// blogDetailHandler: 特定のブログ詳細を返す
func blogDetailHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")

    // URLからauthorIDとblogIDを抽出
    pathParts := strings.Split(r.URL.Path, "/")
    if len(pathParts) < 5 {
        http.Error(w, "Invalid URL path", http.StatusBadRequest)
        return
    }

    authorID, err := strconv.Atoi(pathParts[2])
    if err != nil {
        http.Error(w, "Invalid author ID", http.StatusBadRequest)
        return
    }

    blogID, err := strconv.Atoi(pathParts[4])
    if err != nil {
        http.Error(w, "Invalid blog ID", http.StatusBadRequest)
        return
    }

    // 該当するAuthorのJSONファイルを読み込む
    var author Author
    file := filepath.Join(dataDir, fmt.Sprintf("author%d.json", authorID))
    data, err := os.ReadFile(file)
    if err != nil {
        http.Error(w, "Could not read file", http.StatusInternalServerError)
        return
    }

    if err := json.Unmarshal(data, &author); err != nil {
        http.Error(w, "Could not unmarshal JSON", http.StatusInternalServerError)
        return
    }

    // 指定されたblogIDのBlogを検索
    var foundBlog *Blog
    for _, blog := range author.Blogs {
        if blog.ID == blogID {
            foundBlog = &blog
            break
        }
    }

    if foundBlog == nil {
        http.Error(w, "Blog not found", http.StatusNotFound)
        return
    }

    // Author名とBlogsリストを一緒に返す
    response := struct {
        Name  string `json:"name"`
        Furigana string `json:"furigana"`
        Romaji string `json:"romaji"`
        Blog Blog `json:"blog"`
        Profile Profile `json:"profile"`
    }{
        Name:  author.Name,
        Furigana: author.Furigana,
        Romaji: author.Romaji,
        Blog: *foundBlog,
        Profile: author.Profile,
    }



    if err := json.NewEncoder(w).Encode(response); err != nil {
        http.Error(w, "Could not encode blog data", http.StatusInternalServerError)
    }
}

// memberProfileHandler: 特定の著者のブログ一覧を返す
func memberProfileHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    authorIDStr := strings.TrimPrefix(r.URL.Path, "/profile/")
    authorID, err := strconv.Atoi(authorIDStr)

    if err != nil {
        http.Error(w, "Invalid author ID", http.StatusBadRequest)
        return
    }

    var author Author
    file := filepath.Join(dataDir, fmt.Sprintf("author%d.json", authorID))
    data, err := os.ReadFile(file)
    if err != nil {
        http.Error(w, "Could not read file", http.StatusInternalServerError)
        return
    }

    if err := json.Unmarshal(data, &author); err != nil {
        http.Error(w, "Could not unmarshal JSON", http.StatusInternalServerError)
        return
    }

    // Author名とBlogsリストを一緒に返す
    response := struct {
        Name  string `json:"name"`
        Furigana string `json:"furigana"`
        Romaji string `json:"romaji"`
        Profile Profile `json:"profile"`
    }{
        Name:  author.Name,
        Furigana: author.Furigana,
        Romaji: author.Romaji,
        Profile: author.Profile,
    }

    if err := json.NewEncoder(w).Encode(response); err != nil {
        http.Error(w, "Could not encode blogs data", http.StatusInternalServerError)
    }
}



func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("/", authorsHandler)
	mux.HandleFunc("/blogs/", blogsHandler)
    mux.HandleFunc("/author/", blogDetailHandler)
    mux.HandleFunc("/profile/", memberProfileHandler)
    mux.HandleFunc("/member/", authorsHandler)

    fmt.Println("Server is running on port 8080")
    log.Fatal(http.ListenAndServe(":8080", withCORS(mux))) // apply CORS middleware
}
