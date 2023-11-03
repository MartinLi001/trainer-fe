/* groovylint-disable LineLength */
pipeline {
    agent any
    environment {
        GITHUB_CREDENTIALS_ID = 'Github-SSH'
        GITHUB_BEACONFIRE_PUSH_REF = 'master'
    }
    stages {
        stage('Push Code to Beaconfire') {
            steps {
                echo 'Push Code to Beaconfire ...'
                sshagent(credentials: [GITHUB_CREDENTIALS_ID]) {
                    sh('''
                        #!/usr/bin/env bash
                        set +x
                        export GIT_SSH_COMMAND="ssh -oStrictHostKeyChecking=no"
                        if ! git config remote.beaconfire.url > /dev/null; then
                            git remote add beaconfire git@github.com:BeaconfireSite/seethingx-fe-trainer.git
                        fi
                        git push beaconfire HEAD:$GITHUB_BEACONFIRE_PUSH_REF --force
                     ''')
                }
                echo 'Push Code to Beaconfire Success ...'
            }
        }
    }
}
