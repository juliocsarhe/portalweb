#!/bin/bash
# 1. Remove dependencies in pom.xml
sed -i '' '/<!-- SNS AWS -->/,/<\/dependency>/d' BACKEND/portalroshkabackend/pom.xml
sed -i '' '/<!-- SES AWS -->/,/<\/dependency>/d' BACKEND/portalroshkabackend/pom.xml
sed -i '' '/<!-- SNS aws/,/<\/dependency>--\>/d' BACKEND/portalroshkabackend/pom.xml
sed -i '' '/<dependencyManagement>/,/<\/dependencyManagement>/d' BACKEND/portalroshkabackend/pom.xml

# 2. Update application.properties
sed -i '' '/aws.accessKeyId/d' BACKEND/portalroshkabackend/src/main/resources/application.properties
sed -i '' '/aws.secretAccessKey/d' BACKEND/portalroshkabackend/src/main/resources/application.properties
sed -i '' '/aws.region/d' BACKEND/portalroshkabackend/src/main/resources/application.properties
sed -i '' '/topic.solicitud/d' BACKEND/portalroshkabackend/src/main/resources/application.properties
sed -i '' '/topic.notificacion/d' BACKEND/portalroshkabackend/src/main/resources/application.properties
sed -i '' '/correo.th/d' BACKEND/portalroshkabackend/src/main/resources/application.properties
sed -i '' '/correo.sa/d' BACKEND/portalroshkabackend/src/main/resources/application.properties
sed -i '' '/region: sa-east-1/d' BACKEND/portalroshkabackend/src/main/resources/application.properties
sed -i '' '/arn:aws:sns:sa-east-1/d' BACKEND/portalroshkabackend/src/main/resources/application.properties

# 3. RequestServiceImpl.java
sed -i '' '/import com.backend.portalroshkabackend.notification.aws.NotificacitionServiceAws;/d' BACKEND/portalroshkabackend/src/main/java/com/backend/portalroshkabackend/Services/HumanResource/RequestServiceImpl.java
sed -i '' '/private NotificacitionServiceAws notificacitionServiceAws;/d' BACKEND/portalroshkabackend/src/main/java/com/backend/portalroshkabackend/Services/HumanResource/RequestServiceImpl.java

# 4. EmployeeServiceImpl.java
sed -i '' '/import com.backend.portalroshkabackend.notification.aws.NotificacitionServiceAws;/d' BACKEND/portalroshkabackend/src/main/java/com/backend/portalroshkabackend/Services/HumanResource/EmployeeServiceImpl.java
sed -i '' '/private NotificacitionServiceAws notificacitionServiceAws;/d' BACKEND/portalroshkabackend/src/main/java/com/backend/portalroshkabackend/Services/HumanResource/EmployeeServiceImpl.java
sed -i '' '/notificacitionServiceAws.subscribeNewUserToTopic/d' BACKEND/portalroshkabackend/src/main/java/com/backend/portalroshkabackend/Services/HumanResource/EmployeeServiceImpl.java

# 5. Delete aws and ses directories
rm -rf BACKEND/portalroshkabackend/src/main/java/com/backend/portalroshkabackend/notification/aws
rm -rf BACKEND/portalroshkabackend/src/main/java/com/backend/portalroshkabackend/notification/ses
