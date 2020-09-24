rm -rf docs
yarn build-local
mv src/.vuepress/dist/assets src/.vuepress/dist/assets/v2
# git add docs
# git commit -m "docs: build latest docs"
