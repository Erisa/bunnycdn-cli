# Managing keys and password

Via the `key` command you can add, edit and delete API keys and storage passwords.

## Usage
```console
bnycdn [-t <key_type>] [set|list|del] [<key_name>] [<key_value>] 
```

Possible key_type values:
- apikey (default) : Account API Key
- storages : Storages FTP password

### Examples
#### Add default API Key:
```console
$ bnycdn key set default my_api_key_from_panel
ⓘ Successfully deleted key : default
```

### Add aliased API Key (If you have multiple accounts):

```console
$ bnycdn key set myKeyName my_api_key_from_panel
ⓘ Successfully deleted key : myKeyName
```

#### Add a storage Key:

```console
$ bnycdn key -t storages set mynewkey my_storage_ftp_password
ⓘ Key successfully set: mynewkey
```

#### Add a default storage Key:

```console
$ bnycdn key -t storages set default my_storage_ftp_password
ⓘ Key successfully set: mynewkey
```

#### Delete a key

```console
$ bnycdn key -t storages del mynewkey                        
ⓘ Successfully deleted key : mynewkey
```
