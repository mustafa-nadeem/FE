# Deploying to Surge.sh

## Quick Deploy

1. **Navigate to the build directory:**
   ```bash
   cd build
   ```

2. **Deploy using Surge:**
   ```bash
   npx --yes surge
   ```
   
   When prompted:
   - **project**: Press Enter (uses current directory)
   - **domain**: 
     - For a random subdomain: Press Enter
     - For a custom domain: Enter your domain (e.g., `charity-dinner.surge.sh` or your own domain)

## Using a Custom Domain

If you want to use your own domain:

1. **Create a CNAME file in the build directory:**
   ```bash
   echo "your-domain.com" > build/CNAME
   ```

2. **Deploy:**
   ```bash
   cd build
   npx --yes surge . your-domain.com
   ```

3. **Update your domain's DNS:**
   - Add a CNAME record pointing to `na-west1.surge.sh`
   - Or add an A record pointing to `45.55.110.124`

## Rebuilding Before Deploy

If you made changes, rebuild first:
```bash
npm run build
cd build
npx --yes surge
```

## Account Info

Currently logged in as: mustafanadeem23@gmail.com (Student)
