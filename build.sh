rm -rf docs
yarn build
mv .vuepress/dist docs
# git add docs
# git commit -m "docs: build latest docs"
