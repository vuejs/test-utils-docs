rm -rf tmp
rm -rf src/.vuepress/dist

yarn build:dev

# Nesting dist into a subdirectory inside itself dist/v2
mv src/.vuepress/dist tmp
mkdir -p src/.vuepress/dist/v2
mv tmp/* src/.vuepress/dist/v2

# Pulling up the top-level pages
cp src/.vuepress/dist/v2/*.html src/.vuepress/dist/
