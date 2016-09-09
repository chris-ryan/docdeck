# Getting started with git

### Configuring git on your local computer

**Configure your user details**
```bash
git config --global user.name "Allison Irvin"
git config --global user.email "someperson@gmail.com"
```

### Cloning a remote git project
Browse to the directory on your local computer that you'd like to save the project to
For example, let's say that we wanted to work on the *knowledgebase* project:
we'd make a directory called in our favourite folder called "knowledgebase":
```bash
mkdir -p ~/Development/knowledgebase
cd ~/Development/knowledgebase
```
... and clone the project:
```git clone git.diabcre.cloud:knowledgebase . ```
> note: if your local username is different to your remote username, you'll need to use:
```git clone username@git.diabcre.cloud:knowledgebase```

### Adding new files to be tracked by git
If you've added a new file or folder you need to tell git to track  it using the add command
```git add filename.html```
or for a new folder: ```git add foldername/*```

### Commiting your changes
If you make changes to files, you upload to the server using the ```commit``` command.
``` git commit -am "some message here" ```

### Checking the status
To see the status of the files and folders in your project use the status comman
``` git status ```

### Uploading changes to the server
To publish your committed changes to the server, use the ```push``` command:
Syntax: git push *server* *branch*
eg: ```git push git.diabcre.cloud:knowledgebase master```
last updated: 18 Aug 2016

### List all previous commit and their summary details
```git list --all```

### Visualising changes to files in commits
```gitk --all```

### Rolling back all files to a version from a previous commit.
```git reset --hard *commit id*```

## Administrative stuff
** git remote -v** - shows details of the remote repository of the current git project.