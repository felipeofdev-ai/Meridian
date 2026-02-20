package meridian.branch

deny[msg] {
  input.action == "push"
  input.branch == "main"
  not input.metadata.via_pull_request
  msg := "Direct push to main is not allowed"
}
