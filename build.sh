rm -rf docs
yarn build
mv src/.vuepress/dist docs
# git add docs
# git commit -m "docs: build latest docs"
