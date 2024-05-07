pipeline {
     agent {
         label 'int-node-stg-1'
     }
     stages {
        stage("Build") {
            steps {
                sh "sudo npm i"

            }
        }
        // stage("Deploy") {
        //     steps {
        //         sh "sudo pm2 restart abdel-2026"
        //         sh "echo node-telegramabdel.mobiloitte.io"

        //     }
        // }
    }
}
