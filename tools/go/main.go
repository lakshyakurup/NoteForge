package main

import (
\t"bufio"
\t"flag"
\t"fmt"
\t"os"
\t"strings"
\t"unicode"
)

// NoteForge helper CLI: print basic stats for a notes file.
// go run . -file sample.txt

func main() {
\tpath := flag.String("file", "", "path to notes file")
\tflag.Parse()
\tif *path == "" {
\t\tfmt.Fprintln(os.Stderr, "usage: go run . -file notes.txt")
\t\tos.Exit(1)
\t}

\tf, err := os.Open(*path)
\tif err != nil {
\t\tfmt.Fprintln(os.Stderr, err)
\t\tos.Exit(1)
\t}
\tdefer f.Close()

\tvar chars, words, lines int
\tscanner := bufio.NewScanner(f)
\tscanner.Buffer(make([]byte, 0, 64*1024), 1024*1024)
\tfor scanner.Scan() {
\t\tline := scanner.Text()
\t\tlines++
\t\tchars += len(line) + 1
\t\twords += countWords(line)
\t}
\tif err := scanner.Err(); err != nil {
\t\tfmt.Fprintln(os.Stderr, err)
\t\tos.Exit(1)
\t}

\tfmt.Printf("NoteForge stats for %s\n", *path)
\tfmt.Printf("  lines: %d\n", lines)
\tfmt.Printf("  words: %d\n", words)
\tfmt.Printf("  chars: %d\n", chars)
}

func countWords(s string) int {
\tn := 0
\tinWord := false
\tfor _, r := range s {
\t\tif unicode.IsSpace(r) {
\t\t\tinWord = false
\t\t\tcontinue
\t\t}
\t\tif !inWord {
\t\t\tn++
\t\t\tinWord = true
\t\t}
\t}
\t_ = strings.TrimSpace(s)
\treturn n
}
