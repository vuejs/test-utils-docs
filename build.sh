rm -rf docs
yarn docs:build
mv .vuepress/dist docs
# git add docs
# git commit -m "docs: build latest docs"
