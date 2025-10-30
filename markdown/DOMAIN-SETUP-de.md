# Domain Setup für das Projekt

## Lokale Entwicklung

Für die lokale Entwicklung mit deiner Domain musst du deine lokale Host-Datei bearbeiten:

### Auf MacOS/Linux:

1. Öffne ein Terminal
2. Führe folgenden Befehl aus: `sudo nano /etc/hosts`
3. Füge folgende Zeile hinzu:

```
127.0.0.1    your-domain.de
```

4. Speichere die Datei (in nano: Ctrl+O, dann Enter, dann Ctrl+X)

### Auf Windows:

1. Öffne den Notepad als Administrator
2. Öffne die Datei: `C:\Windows\System32\drivers\etc\hosts`
3. Füge folgende Zeile hinzu:

```
127.0.0.1    your-domain.de
```

4. Speichere die Datei

## Lokaler Entwicklungsserver

Starte den Entwicklungsserver mit:

```bash
npm run dev
```

Nun kannst du folgende URL in deinem Browser verwenden:

- Frontend: http://your-domain.de:3000

## Produktions-Setup

Für die Produktion musst du:

1. Die Domain bei deinem DNS-Provider konfigurieren, sodass sie auf deinen Server zeigt
2. HTTPS mit SSL-Zertifikat für die Domain einrichten
3. Einen Reverse-Proxy (wie Nginx) konfigurieren, der die Anfragen an deine Next.js-Anwendung weiterleitet

### Beispiel Nginx-Konfiguration

```nginx
server {
    listen 80;
    server_name your-domain.de www.your-domain.de;

    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.de www.your-domain.de;

    # SSL-Konfiguration
    ssl_certificate /pfad/zu/deinem/zertifikat.pem;
    ssl_certificate_key /pfad/zu/deinem/privaten_schluessel.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
