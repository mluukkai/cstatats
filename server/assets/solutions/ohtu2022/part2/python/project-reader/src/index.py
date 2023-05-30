from project_reader import ProjectReader


def main():
    url = "https://raw.githubusercontent.com/ohjelmistotuotanto-hy-avoin/python-kevat-2021/main/koodi/viikko3/web-login-robot/pyproject.toml"
    reader = ProjectReader(url)
    print(reader.get_project())


if __name__ == "__main__":
    main()
