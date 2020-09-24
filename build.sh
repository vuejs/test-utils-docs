rm -rf tmp
rm -rf src/.vuepress/dist
yarn build-local
mv src/.vuepress/dist tmp
mv src/.vuepress/dist tmp
mkdir -p src/.vuepress/dist/v2
mv tmp/* src/.vuepress/dist/v2
cp src/.vuepress/dist/v2/*.html src/.vuepress/dist/
